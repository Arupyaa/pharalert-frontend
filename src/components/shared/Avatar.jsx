export default function Avatar({avatarImg}) {
  
  if(avatarImg==null){
    var AvatarImg = <div className="bg-brand-light rounded-full w-10 h-10 flex justify-center items-center font-bold text-heading">A</div>
  }else{
    var AvatarImg = <img src={avatarImg} alt="avatar icon" className='rounded-full w-10' />
  }
  return (
    <>
    {AvatarImg}
    </>
  )
}
