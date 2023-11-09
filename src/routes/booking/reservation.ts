import { trpc } from "@/config";
import completeReservation from "@/controllers/booking/reservation/complete";
import createReservation from "@/controllers/booking/reservation/create";
import deleteReservation from "@/controllers/booking/reservation/delete";
import getAllReservations from "@/controllers/booking/reservation/get-all";
import updateReservation from "@/controllers/booking/reservation/update";

const router = trpc.router;

const reservationRouter = router({
  getAll: getAllReservations,
  create: createReservation,
  delete: deleteReservation,
  update: updateReservation,
  complete: completeReservation,
});

export default reservationRouter;
