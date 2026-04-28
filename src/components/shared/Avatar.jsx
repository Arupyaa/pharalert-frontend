export default function Avatar({ avatarImg, avatarName }) {
  //if no name was provided give it default name of Avatar
  if (avatarName == null || avatarName == '') {
    avatarName = 'Avatar';
  }

  if (avatarImg == null) {
    var AvatarImg = <div className="bg-brand-light rounded-full w-10 h-10 flex justify-center items-center font-bold text-heading">{getInitials(avatarName)}</div>
  } else {
    var AvatarImg = <img src={avatarImg} alt="avatar icon" className='rounded-full w-10' />
  }
  return (
    <>
      {AvatarImg}
    </>
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
