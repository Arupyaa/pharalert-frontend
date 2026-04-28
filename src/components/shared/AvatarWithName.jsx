export default function AvatarWithName({avatarImg,avatarName}) {
  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-2 gap-x-2">
      <img src={avatarImg} alt="avatar icon" className='rounded-full row-span-2 col-start-1 w-10' />
      <p className='font-bold truncate text-heading row-start-1 col-start-2'>{avatarName}</p>
      <p className='text-paragraph row-start-2 col-start-2'>View Account</p>
    </div>
  )
}
