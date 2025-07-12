

export const UserCard = ({ name, plan }: any) => {
  return <div className="text-center mb-6">
    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
      {name.split(' ').map((n: any) => n[0]).join('')}
    </div>
    <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-2">
      {plan} Plan
    </span>
  </div>
}

export function UserCardSkeleton() {
  return (
    <div className="text-center mb-6 animate-pulse select-none">
      <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4" />
      <div className="h-5 w-32 bg-gray-300 rounded mx-auto mb-2" />
      {/*<div className="h-4 w-48 bg-gray-200 rounded mx-auto mb-2" />*/}
      <div className="h-6 w-24 bg-gray-200 rounded mx-auto" />
    </div>
  );
}