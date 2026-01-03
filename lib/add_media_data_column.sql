DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media_items' AND column_name='data') THEN
        ALTER TABLE media_items ADD COLUMN data TEXT;
    END IF;
END $$;
