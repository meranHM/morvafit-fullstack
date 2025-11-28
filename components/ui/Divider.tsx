type DividerProps = {
  className?: string
}

const Divider: React.FC<DividerProps> = ({ className }) => {
  return (
    <div className={`w-full max-w-7xl mx-auto flex items-center py-4 ${className}`}>
      <div className="h-2.5 w-0.5 bg-gray-500" />
      <div className="flex-1 h-px bg-gray-500" />
      <div className="h-2.5 w-0.5 bg-gray-500" />
    </div>
  )
}

export default Divider
