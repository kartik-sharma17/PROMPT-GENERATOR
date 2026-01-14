export const TypingIndicator = () => {
  return (
    <div className="flex space-x-1 items-center bg-[#282727] w-max px-4 py-2.5 rounded-lg">
      {/* Three dots with staggered bounce */}
      <span className="w-1.5 h-1.5 bg-[#929294] rounded-full animate-bounce [animation-delay:0s]"></span>
      <span className="w-1.5 h-1.5 bg-[#929294] rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-1.5 h-1.5 bg-[#929294] rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  );
};
