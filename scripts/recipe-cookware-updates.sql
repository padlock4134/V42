-- SQL update statements for recipes with three-level tagging for cookware
-- Generated on 2025-04-02T10:46:17.359Z

BEGIN;

-- Recipe: Gyoza
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '0105782c-3e89-4899-8593-25d9edb49765';

-- Recipe: Ratatouille
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = '019cc17d-20c8-40c6-8b13-2a5fad2f2f14';

-- Recipe: Caprese Salad
UPDATE recipes SET
  cookware_category = ARRAY['cookware']
WHERE id = '02584320-f3e4-4614-9206-29cd9e6df88a';

-- Recipe: Buffalo Wings
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '04e6f68c-c98d-4948-8d07-93bbe0fbb00f';

-- Recipe: Teriyaki Chicken
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '05a8d2b6-4ff4-42f9-a42d-6ea64ca651d5';

-- Recipe: Moules Marinières
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = '0a64c676-a9d8-4c93-a6ac-b8509460b794';

-- Recipe: Lamb Souvlaki
UPDATE recipes SET
  cookware_category = ARRAY['cookware']
WHERE id = '0aa0cc3f-2faa-4e67-ac15-4fbf39598ecb';

-- Recipe: Shakshuka
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '0c53691b-f94c-4497-aff3-03ecec80a3cc';

-- Recipe: Clam Chowder
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '0dba0dfc-e6b1-49af-ac89-038f8a52b273';

-- Recipe: Meatloaf
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '111a0952-219c-4d8c-a67a-f5a84416de4c';

-- Recipe: Salade Niçoise
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '1ae50281-0c95-4b7d-bb57-044b126632b4';

-- Recipe: Greek Moussaka
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '1b0ab440-aca4-4fa2-b28a-9c66a11dedf2';

-- Recipe: Tandoori Chicken
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['bakeware'],
  cookware_variety = ARRAY['sheet']
WHERE id = '1d976de8-6715-4026-8b96-a028e5e01559';

-- Recipe: Chilaquiles
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '20694dd8-3bc6-4f6d-a9b5-19b03f1ec70e';

-- Recipe: Mac and Cheese
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['sauce']
WHERE id = '222b3b41-4616-4c42-a42a-3745b1fdd659';

-- Recipe: Tempura
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '27c539e5-7bb2-4556-88ac-d108bafd30ed';

-- Recipe: Mansaf
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '2c3f03f3-cfa1-4031-8ebc-0073091e30cd';

-- Recipe: Cassoulet
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = '2f562d2a-bf45-433f-84af-f0d3e8d4a11d';

-- Recipe: Chicken Stir Fry
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans'],
  cookware_variety = ARRAY['frying']
WHERE id = '2fa466bb-3e13-42a2-aafa-1afa821d696b';

-- Recipe: Quiche Lorraine
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '2ff65408-51e0-4445-9585-db4606964bed';

-- Recipe: Okonomiyaki
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '330f9d30-9492-4a61-bf30-3b0089bb3838';

-- Recipe: Enchiladas Verdes
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '33894fcc-f812-43b9-b78a-3e3261d8b0c7';

-- Recipe: Falafel
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '33d66afe-e323-411d-b73c-baf40fa728dd';

-- Recipe: Pozole Rojo
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '344b7eb1-18d3-4dfa-b124-31432af43c6b';

-- Recipe: Yakitori
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans'],
  cookware_variety = ARRAY['grill']
WHERE id = '35049846-dab3-4c76-8800-f1ba5ad0580f';

-- Recipe: Penne all'Arrabbiata
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '35c127bf-f0a5-468e-b94e-6dd50ba1eed1';

-- Recipe: BBQ Ribs
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['bakeware'],
  cookware_variety = ARRAY['sheet']
WHERE id = '428d1e74-ea43-45df-9f6a-b2da665c0e5f';

-- Recipe: Butter Chicken (Murgh Makhani)
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '50f970d9-c7e9-4c78-b6ca-4d105ff49967';

-- Recipe: Dal Makhani
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['pressure']
WHERE id = '518d6bed-8132-4efa-bbef-633a4d60fd5b';

-- Recipe: Lamb Kofta Kebabs
UPDATE recipes SET
  cookware_category = ARRAY['cookware']
WHERE id = '5548e330-00d7-482d-9a47-edcdcb968d23';

-- Recipe: Rogan Josh
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '578ce46c-e72d-44e6-894b-eabcb20007ba';

-- Recipe: Chiles Rellenos
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '90ab3e8b-2d7a-4f1a-bea5-5da5d0975fdb';

-- Recipe: Bouillabaisse
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = '5adc77c4-97d9-49db-b7bc-cd23bfdb61b1';

-- Recipe: Jambalaya
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = '5e895b9e-d150-45ca-a4e2-c1e2fda5a747';

-- Recipe: Palak Paneer
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '6260eea4-3a8b-4565-992f-ff60b02a2139';

-- Recipe: Mujadara
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '6688804f-02f8-48b3-a8ff-387ecdf923c3';

-- Recipe: Chicken Shawarma
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['bakeware'],
  cookware_variety = ARRAY['sheet']
WHERE id = '6ca37716-cf82-42d1-b95a-16ff9a66fc3a';

-- Recipe: Pot-au-Feu
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '720b0b58-6720-4dcf-a6a9-fb26c35c2112';

-- Recipe: Paella Valenciana
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '72cf1957-178d-4d0c-91b1-b6e2f5f24292';

-- Recipe: Pizza Margherita
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['bakeware'],
  cookware_variety = ARRAY['sheet']
WHERE id = '78155fdb-c537-47c7-a9d3-9c3f57305785';

-- Recipe: Fattoush Salad
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['bakeware'],
  cookware_variety = ARRAY['sheet']
WHERE id = '7a038eeb-5604-47a3-851f-f3fbef309b43';

-- Recipe: Hamburgers
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans'],
  cookware_variety = ARRAY['grill']
WHERE id = '7a72a2a0-4608-4008-a664-854f830bafd8';

-- Recipe: Lasagna alla Bolognese
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '90bc5cda-c687-4c5f-bfc4-88e186852001';

-- Recipe: Aloo Gobi
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '7c8abacc-f2af-416b-bc7f-68aa83affe8e';

-- Recipe: Sushi Rolls
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '7e30f063-e61e-47ad-ad3b-a798b25dc507';

-- Recipe: Tacos al Pastor
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans'],
  cookware_variety = ARRAY['grill']
WHERE id = '7f52d312-1372-413d-9083-4bb75ca2afa3';

-- Recipe: Tonkatsu
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '87bfa2f6-5ad5-4238-84db-7909367d0194';

-- Recipe: Chicken Marsala
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '88c7df6b-6d51-4d77-8969-254e93ff36bf';

-- Recipe: Fried Chicken
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = '8a7a471b-7865-44a4-929a-5cf64a554ddc';

-- Recipe: Vegetable Pasta
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = '9152cf8e-1410-4348-acf2-c3af65a5569c';

-- Recipe: Malai Kofta
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = '95f59389-ac67-4c33-a090-b0d8bed1402c';

-- Recipe: Herb Roasted Potatoes
UPDATE recipes SET
  cookware_category = ARRAY['cookware']
WHERE id = '96d1a385-4fde-4c60-8105-29b0252b0fda';

-- Recipe: Marseille Bouillabaisse
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['stock']
WHERE id = '9c1263ac-e3b8-4326-8fe5-4287dd984580';

-- Recipe: Carnitas
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = 'a12dce23-5b68-4659-9d9f-15c8b30b6fef';

-- Recipe: Minestrone Soup
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = 'a1d20051-bb0c-4532-ab9e-e1c1c65dcaba';

-- Recipe: Osso Buco
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = 'a84f8e88-374b-4a15-9136-f0873eb388eb';

-- Recipe: Miso Soup
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = 'a8917c2e-2f79-4f9b-9811-0a8fd5d1a360';

-- Recipe: Philly Cheesesteak
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = 'a99e24bb-53c0-4b24-a593-d8edaf36f190';

-- Recipe: Chicken Tikka Masala
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans'],
  cookware_variety = ARRAY['grill']
WHERE id = 'b1a00cc5-7113-412e-98b4-f338e51a6d34';

-- Recipe: Szechuan Beef Stir-Fry
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans'],
  cookware_variety = ARRAY['wok']
WHERE id = 'b2ae2fa4-dafa-490a-b95b-dbfd469b0339';

-- Recipe: Spaghetti Carbonara
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = 'b3918562-3038-4e4e-8e72-85fa66c20ea5';

-- Recipe: Boeuf Bourguignon
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = 'b439f691-83da-4509-8d06-c8e53e583f6e';

-- Recipe: Lobster Roll
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = 'baa1464b-a6fc-45c5-a9ae-1534ed3eeb6a';

-- Recipe: Gnocchi al Pesto
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = 'ce2ad213-1c98-4470-b9ed-2843905fe046';

-- Recipe: Risotto ai Funghi
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = 'cefe2de4-9003-42b1-953d-dc2e5890ae8f';

-- Recipe: Baba Ganoush
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['bakeware'],
  cookware_variety = ARRAY['sheet']
WHERE id = 'd225922a-b61a-4d69-a502-820660a47b9b';

-- Recipe: Ramen
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['sauce']
WHERE id = 'e5b76021-be25-4ddc-b85c-f7ec39463f27';

-- Recipe: Soupe à l'Oignon
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = 'd3ec874c-6248-4f5b-9f09-16e7ba2fc158';

-- Recipe: Coq au Vin
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = 'd6c89860-43ae-48dc-b6e2-588c8a1a2c75';

-- Recipe: Lebanese Tabbouleh
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['knives']
WHERE id = 'db24cd00-d590-475d-9201-7daa349ef2cf';

-- Recipe: Barbacoa
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = 'de950ec5-6806-48d7-8a9f-cfb754756377';

-- Recipe: Chicken Pot Pie
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = 'deda223f-ef9c-48f0-97c0-0708dd07e594';

-- Recipe: Chana Masala
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots']
WHERE id = 'e9713a0c-ba3f-4ade-bf01-df7ca0b1fc08';

-- Recipe: Beef Wellington
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pans']
WHERE id = 'f306de8e-8e1f-4376-b564-b96ec01ccd69';

-- Recipe: Ceviche
UPDATE recipes SET
  cookware_category = ARRAY['cookware']
WHERE id = 'f4f460eb-d707-4e0c-ae29-91204b7bdc5d';

-- Recipe: Chicken Biryani
UPDATE recipes SET
  cookware_category = ARRAY['cookware'],
  cookware_type = ARRAY['pots'],
  cookware_variety = ARRAY['dutch']
WHERE id = 'fb5aa9be-6cce-49a4-9b18-b43811d7adfe';

COMMIT;
