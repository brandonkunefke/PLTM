import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllPlayers, 
  getPlayerById, 
  createPlayer, 
  updatePlayer, 
  deletePlayer 
} from '@/lib/models/player';

export async function GET() {
  try {
    const players = await getAllPlayers();
    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { message: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { message: 'Player name is required' },
        { status: 400 }
      );
    }
    
    const playerId = await createPlayer({
      name: data.name,
      email: data.email,
      phone: data.phone,
      is_dealer: data.is_dealer || false,
      notes: data.notes
    });
    
    if (!playerId) {
      return NextResponse.json(
        { message: 'Failed to create player' },
        { status: 500 }
      );
    }
    
    const newPlayer = await getPlayerById(playerId);
    
    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { message: 'Failed to create player' },
      { status: 500 }
    );
  }
}
