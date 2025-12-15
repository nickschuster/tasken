ALTER TABLE "task" ADD COLUMN "order" text;

WITH ordered AS (
    SELECT
        id,
        ROW_NUMBER() OVER (PARTITION BY task.user_id ORDER BY task.created_at ASC) AS rownum
    FROM task
)
UPDATE task
SET "order" = (
    SELECT LPAD(rownum::TEXT, 5, '0')
    FROM ordered o
    WHERE o.id = task.id
);
