import { trpc } from "@/config";
import createTypeInventory from "@/controllers/inventory/types/create";
import deleteTypeInventory from "@/controllers/inventory/types/delete";
import getAllTypesInventory from "@/controllers/inventory/types/get-all";
import updateTypeInventory from "@/controllers/inventory/types/update";

const router = trpc.router;

const typeProductRouter = router({
  getAll: getAllTypesInventory,
  create: createTypeInventory,
  update: updateTypeInventory,
  delete: deleteTypeInventory,
});

export default typeProductRouter;
