import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { groupPostsByDay } from "../../Utils/groupPosts";
const PostAnalytics = ({ posts }: { posts: any[] }) => {
  console.log(posts);

  const data = groupPostsByDay(posts);

  return (
    <div className="p-2 my-2 rounded-xl  w-full max-w-[90%] bg-gray-200">
      <h2 className="text-xl font-bold mb-4">Posts Per Day (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#195e3d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#195e3d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="posts"
            stroke="#195e3d"
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default PostAnalytics;
