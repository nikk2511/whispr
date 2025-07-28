// Email verification has been disabled
// Users are automatically verified upon registration

export async function POST(request: Request) {
  return Response.json(
    {
      success: false,
      message: 'Email verification has been disabled. All accounts are automatically verified.',
    },
    { status: 404 }
  );
}