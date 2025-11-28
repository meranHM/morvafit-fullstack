type MiniTitleProps = {
  text: string
  className?: string
}

const MiniTitle: React.FC<MiniTitleProps> = ({ text, className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-0.5 h-4 bg-amber-500" />
      <p className="font-medium text-lg">{text}</p>
    </div>
  )
}

export default MiniTitle
