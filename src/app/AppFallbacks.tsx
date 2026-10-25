// shown by the router while appLoader() runs, and if it fails

export function AppLoading() {
  return <div className='h-screen flex items-center justify-center'>Loading...</div>
}

export function AppError() {
  return <div className='h-screen flex items-center justify-center text-red-500'>Could not open the local database.</div>
}
