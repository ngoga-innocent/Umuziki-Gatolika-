// components/TopLoadingBar.tsx
export default function TopLoadingBar({ isLoading }: { isLoading: boolean }) {
  return (
    <div className={`fixed top-0 left-0 h-1 bg-yellow-400 z-50 transition-all duration-300 ${isLoading ? 'w-full' : 'w-0'}`} />
  );
}
