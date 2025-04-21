import { NextRequest, NextResponse } from 'next/server';
import { 
  getPlayerById, 
  updatePlayer, 
  deletePlayer 
} from '@/lib/models/player';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid player ID' },
        { status: 400 }
      );
    }
    
    const player = await getPlayerById(id);
    
    if (!player) {
      return NextResponse.json(
        { message: 'Player not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { message: 'Failed to fetch player' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid player ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { message: 'Player name is required' },
        { status: 400 }
      );
    }
    
    const success = await updatePlayer(id, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      is_dealer: data.is_dealer,
      notes: data.notes
    });
    
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to update player' },
        { status: 500 }
      );
    }
    
    const updatedPlayer = await getPlayerById(id);
    
    return NextResponse.json(updatedPlayer);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { message: 'Failed to update player' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid player ID' },
        { status: 400 }
      );
    }
    
    const success = await deletePlayer(id);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to delete player' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { message: 'Failed to delete player' },
      { status: 500 }
    );
  }
}
