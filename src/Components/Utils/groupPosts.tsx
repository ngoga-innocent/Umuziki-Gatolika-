import { startOfDay, format, subDays } from "date-fns";

const getLast7Days = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, "yyyy-MM-dd"),
      count: 0,
    };
  });
};

export const groupPostsByDay = (posts: any[]) => {
  const days = getLast7Days();
  const dayMap: { [key: string]: number } = {};

  posts?.forEach((post) => {
    const postDate = format(new Date(post.createdAt), "yyyy-MM-dd");
    if (!dayMap[postDate]) {
      dayMap[postDate] = 0;
    }
    dayMap[postDate]++;
  });

  return days.map((day) => ({
    date: format(new Date(day.date), "EEE"), // Mon, Tue...
    posts: dayMap[day.date] || 0,
  }));
};
