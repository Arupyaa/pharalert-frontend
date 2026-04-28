export default function AvatarWithName({ avatarImg, avatarName }) {
  //if no name was provided give it default name of Avatar
  if (avatarName == null || avatarName == '') {
    avatarName = 'Avatar';
  }

  //display either the user avatar or image with user initials
  if (avatarImg == null) {
    var AvatarImg = <div className="bg-brand-light rounded-full w-10 h-10 flex justify-center items-center row-span-2 col-start-1 font-bold text-heading">{getInitials(avatarName)}</div>
  } else {
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

//utility function to get user initials 
function getInitials(username) {
  return username
    .trim()
    .split(/\s+/)          // split by one or more spaces
    .filter(word => /^[a-zA-Z]/.test(word)) // keep only words starting with letters
    .slice(0, 2)           // take first two words only
    .map(word => word[0].toUpperCase())
    .join(" ");
}