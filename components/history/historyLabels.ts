import { HistoryEntry } from "@/stores/history.store";

export function getHistoryLabel(entry: HistoryEntry): string {
  switch (entry.action.type) {
    case "initialize":
      return "Initialized";
    case "typing":
      return "Typing";
    case "block-move":
      return "Moved block";
    case "block-add":
      return "Added block";
    case "block-delete":
      return "Deleted block";
    case "page-create":
      return "Created page";
    case "page-delete":
      return "Deleted page";
      case "block-move-by-id":
      return "Draged block";
    default:
      return "Action";
  }
}
