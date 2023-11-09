import { trpc } from "@/config";
import createGroupInventory from "@/controllers/inventory/groups/create";
import deleteGroupInventory from "@/controllers/inventory/groups/delete";
import getAllGroupsInventory from "@/controllers/inventory/groups/get-all";
import updateGroupInventory from "@/controllers/inventory/groups/update";

const router = trpc.router;

const groupProductRouter = router({
  getAll: getAllGroupsInventory,
  create: createGroupInventory,
  update: updateGroupInventory,
  delete: deleteGroupInventory,
});

export default groupProductRouter;
