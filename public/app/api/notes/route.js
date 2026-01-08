import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI;
const dbName = "notesDB";
const collection = "notes";

async function connectDB() {
  const client = await MongoClient.connect(uri);
  return { client, db: client.db(dbName) };
}

// GET all notes
export async function GET() {
  try {
    const { client, db } = await connectDB();
    const notes = await db.collection(collection).find().toArray();
    client.close();
    return NextResponse.json(notes);
  } catch {
    return NextResponse.json([]);
  }
}

// CREATE note
export async function POST(req) {
  const body = await req.json();
  const { client, db } = await connectDB();

  const result = await db.collection(collection).insertOne(body);
  client.close();

  return NextResponse.json({ _id: result.insertedId, ...body });
}

// UPDATE note
export async function PUT(req) {
  const { id, title, content } = await req.json();
  const { client, db } = await connectDB();

  await db.collection(collection).updateOne(
    { _id: new ObjectId(id) },
    { $set: { title, content } }
  );

  client.close();
  return NextResponse.json({ success: true });
}

// DELETE note
export async function DELETE(req) {
  const { id } = await req.json();
  const { client, db } = await connectDB();

  await db.collection(collection).deleteOne({
    _id: new ObjectId(id),
  });

  client.close();
  return NextResponse.json({ success: true });
}