import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnection } from '@/config/db';
import { authOptions } from '@/lib/authOptions';
import User, { IUser } from '@/models/user.model';
import { User as UserInterface} from '@/interfaces';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnection();

    const currentUser = await User.findById(session.user.id).lean<IUser>();
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let suggestedUsers: UserInterface[] = [];
    let randomUsers: UserInterface[] = [];

    if (currentUser.techStack && currentUser.techStack.length > 0) {
      suggestedUsers = await User.find({
        _id: { $ne: currentUser._id },
        techStack: { $in: currentUser.techStack },
      })
        .limit(15)
        .lean<IUser>();

      const excludeIds = suggestedUsers.map(user => user._id);
      excludeIds.push(currentUser._id);

      randomUsers = await User.aggregate([
        { $match: { _id: { $nin: excludeIds } } },
        { $sample: { size: 15 } },
      ]);
    } else {
      randomUsers = await User.aggregate([
        { $match: { _id: { $ne: currentUser._id } } },
        { $sample: { size: 15 } },
      ]);
    }

    return NextResponse.json({ suggestedUsers, randomUsers });
  } catch (err) {
    console.error('[TOP_COLLABORATORS_ERROR]', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
