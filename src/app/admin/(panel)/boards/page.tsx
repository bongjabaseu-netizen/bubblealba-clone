import { getBoards } from "@/lib/actions/admin";
import { BoardsClient } from "./BoardsClient";

export default async function AdminBoardsPage() {
  const boards = await getBoards();
  return <BoardsClient boards={boards} />;
}
