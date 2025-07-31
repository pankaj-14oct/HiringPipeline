interface PipelineStageProps {
  stage: string;
  count: number;
  color: string;
}

export default function PipelineStage({ stage, count, color }: PipelineStageProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <span className="font-medium text-gray-900">{stage}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-gray-900">{count}</span>
        <span className="text-sm text-gray-600">candidates</span>
      </div>
    </div>
  );
}
