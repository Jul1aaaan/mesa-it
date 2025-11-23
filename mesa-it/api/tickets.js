import fs from "fs";
import path from "path";

const ticketsPath = path.join(process.cwd(), "tickets.json");

function loadTickets() {
  if (!fs.existsSync(ticketsPath)) {
    fs.writeFileSync(ticketsPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(ticketsPath, "utf8"));
}

function saveTickets(tickets) {
  fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 2));
}

export default function handler(req, res) {
  if (req.method === "POST") {
    const tickets = loadTickets();
    const newTicket = {
      id: tickets.length + 1,
      timestamp: new Date().toISOString(),
      ...req.body,
    };

    tickets.push(newTicket);
    saveTickets(tickets);

    return res.status(201).json({ message: "Ticket creado", ticket: newTicket });
  }

  if (req.method === "GET") {
    const tickets = loadTickets();
    return res.status(200).json(tickets);
  }

  return res.status(405).json({ error: "Método no permitido" });
}
