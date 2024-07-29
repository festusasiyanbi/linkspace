/* eslint-disable radix */
export const FormatDateAndTime = (postDate: any): string => {
  const currentDate = new Date();
  let postDateTime: Date;

  if (postDate instanceof Date) {
    postDateTime = postDate;
  } else if (typeof postDate === 'number') {
    postDateTime = new Date(postDate);
  } else if (typeof postDate === 'string') {
    postDateTime = new Date(postDate);

    if (isNaN(postDateTime.getTime())) {
      const parts = postDate.split(/[- :]/);
      postDateTime = new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1,
        parseInt(parts[2]),
        parseInt(parts[3] || '0'),
        parseInt(parts[4] || '0'),
        parseInt(parts[5] || '0'),
      );
    }
  } else if (postDate && typeof postDate === 'object' && 'toDate' in postDate) {
    postDateTime = postDate.toDate();
  } else {
    return 'Invalid postDate format';
  }

  if (isNaN(postDateTime.getTime())) {
    return 'Invalid date';
  }

  const timeDiff = currentDate.getTime() - postDateTime.getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }
  if (hours < 24) {
    return `${hours}h`;
  }
  if (days < 30) {
    return `${days}d`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months}mo`;
  }
  const years = Math.floor(days / 365);
  return `${years}y`;
};

export default FormatDateAndTime;
