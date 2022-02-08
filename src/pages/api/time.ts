export const convertTimeStamp = (timeStamp: string) => {
  const parts = timeStamp.split(':');
  let time = 0;
  time += Number.parseInt(parts[0]) * 3600;
  time += Number.parseInt(parts[1]) * 60;
  time += Number.parseInt(parts[2].replace(',', '.'));
  return time;
};
