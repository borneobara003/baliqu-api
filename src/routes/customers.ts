import { trpc } from "@/config";
import createCustomerFromAdmin from "@/controllers/customers/create-from-admin";
import deleteCustomer from "@/controllers/customers/delete";
import getAllCustomers from "@/controllers/customers/get-all";
import updateCustomerFromAdmin from "@/controllers/customers/update-from-admin";

const router = trpc.router;

const customerRouter = router({
  getAll: getAllCustomers,
  create: createCustomerFromAdmin,
  update: updateCustomerFromAdmin,
  delete: deleteCustomer,
});

export default customerRouter;
