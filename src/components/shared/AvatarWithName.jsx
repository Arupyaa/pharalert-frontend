export default function AvatarWithName({avatarImg,avatarName}) {
if(avatarImg==null){
    var AvatarImg = <div className="bg-brand-light rounded-full w-10 h-10 flex justify-center items-center row-span-2 col-start-1 font-bold text-heading">A</div>
  }else{
    var AvatarImg = <img src={avatarImg} alt="avatar icon" className='rounded-full row-span-2 col-start-1 w-10' />
  }

  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-2 gap-x-2">
      {AvatarImg}
      <p className='font-bold truncate text-heading row-start-1 col-start-2'>{avatarName}</p>
      <p className='text-paragraph row-start-2 col-start-2'>View Account</p>
    </div>
  )
}
