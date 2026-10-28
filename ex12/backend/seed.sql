INSERT INTO public."type" (name)
SELECT 'Bakery' WHERE NOT EXISTS (SELECT 1 FROM public."type");

INSERT INTO public.menu (name, price, "isBestSeller", "typeId")
SELECT item.name, item.price, item."isBestSeller", (SELECT MIN("typeId") FROM public."type")
FROM (VALUES
  ('cookie', 55, TRUE),
  ('donut', 45, FALSE),
  ('milk', 15, TRUE),
  ('bread', 25, FALSE),
  ('cake', 35, TRUE)
) AS item (name, price, "isBestSeller")
WHERE NOT EXISTS (SELECT 1 FROM public.menu);
