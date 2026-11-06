-- The existing database already has this constraint. New databases need it
-- after 20261105141037_init creates users.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = '"Cat"'::regclass
          AND conname = 'Cat_userId_fkey'
    ) THEN
        ALTER TABLE "Cat" ADD CONSTRAINT "Cat_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
