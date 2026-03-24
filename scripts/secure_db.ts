import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lywpvjvqbeqtgswubhcv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5d3B2anZxYmVxdGdzd3ViaGN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMwMzExNywiZXhwIjoyMDg5ODc5MTE3fQ.d3Uz4PcCvZ0j-byhMUUsTGzDmr2qXjfC2SffzRydJz8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sql = `
  -- 1. Add user_id to orders if it doesn't exist
  DO $$ 
  BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_id') THEN
      ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
  END $$;

  -- 2. Fix RLS Policies for Orders
  DROP POLICY IF EXISTS "Public can read orders" ON orders;
  DROP POLICY IF EXISTS "Admin can manage orders" ON orders;
  DROP POLICY IF EXISTS "Users can read own orders" ON orders;
  DROP POLICY IF EXISTS "Users can create orders" ON orders;

  CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (
    auth.uid() = user_id OR 
    email = (select email from auth.users where id = auth.uid())
  );

  CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (true);

  CREATE POLICY "Admin can manage orders" ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

  -- 3. Fix RLS Policies for Order Items
  DROP POLICY IF EXISTS "Public can read order items" ON order_items;
  DROP POLICY IF EXISTS "Admin can manage order items" ON order_items;
  DROP POLICY IF EXISTS "Users can read own order items" ON order_items;

  CREATE POLICY "Users can read own order items" ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (
        orders.user_id = auth.uid() OR 
        orders.email = (select email from auth.users where id = auth.uid())
      )
    )
  );

  CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (true);

  CREATE POLICY "Admin can manage order items" ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

  -- 4. Fix RLS for Products (Public Read, Admin Write)
  DROP POLICY IF EXISTS "Public can read products" ON products;
  DROP POLICY IF EXISTS "Admin can manage products" ON products;
  
  CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
  CREATE POLICY "Admin can manage products" ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

  -- 5. Fix RLS for Settings (Public Read, Admin Write)
  DROP POLICY IF EXISTS "Public can read settings" ON settings;
  DROP POLICY IF EXISTS "Admin can manage settings" ON settings;

  CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);
  CREATE POLICY "Admin can manage settings" ON settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
`;

async function runMigration() {
  console.log('Applying security patches...');
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async () => {
     // Fallback if exec_sql RPC is not available (common), try raw SQL via another method if possible, 
     // or mostly relying on the standard query execution if supported. 
     // Since we don't have direct SQL access via client usually without a specific function, 
     // we will try to run this via a custom RPC if it existed, but likely it doesn't.
     // HOWEVER, standard Supabase doesn't expose SQL execution via JS client unless enabled.
     // User provided "supabaseAdmin" so I can assume I *might* have power, but usually I need the SQL editor.
     // Re-reading context: I don't have a "run sql" tool.
     // I will try to use the REST API 'rpc' if they have a generic sql executor, otherwise I cannot patch the DB remotely from here easily.
     // BUT, I can rely on the user running the schema.sql. 
     // WAIT. The prompt "realiza todo" implies I should try my best.
     // Since I cannot guarantee direct SQL execution without an RPC, I will Update schema.sql 
     // AND update the client code to be secure. The remote DB might remain insecure until they run the SQL, 
     // but the *code* I leave them with will be secure.
     //
     // ACTUALLY, I can use the `postgres` library if I had the connection string, but I only have the URL/Key.
     //
     // ALTERNATIVE: I will skip the remote patching via script if I can't be sure it works, 
     // but I will UPDATE `src/supabase/schema.sql` with the CORRECT policies so the user can copy-paste it.
     return { error: 'Direct SQL execution not available via client' };
  });

  if (error) {
    console.log('Could not apply remote patch automatically (expected). Please run src/supabase/schema.sql in your Supabase SQL Editor.');
  } else {
    console.log('Security patch applied successfully!');
  }
}

runMigration();
