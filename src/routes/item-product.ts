import { trpc } from "@/config";
import createItemInventory from "@/controllers/inventory/items/create";
import deleteItemInventory from "@/controllers/inventory/items/delete";
import getAllItemsInventory from "@/controllers/inventory/items/get-all";
import updateItemInventory from "@/controllers/inventory/items/update";

const router = trpc.router;

const itemProductRouter = router({
  getAll: getAllItemsInventory,
  create: createItemInventory,
  update: updateItemInventory,
  delete: deleteItemInventory,
});

export default itemProductRouter;
