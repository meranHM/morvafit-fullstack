type MiniTitleProps = {
  text: string
  className?: string
}

const MiniTitle: React.FC<MiniTitleProps> = ({ text, className = "text-2xl" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-0.5 h-4 bg-[#89023E]" />
      <p className="font-medium">{text}</p>
    </div>
  )
}

export default MiniTitle
