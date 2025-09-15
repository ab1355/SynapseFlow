import BrainDumpInput from "../BrainDumpInput";

export default function BrainDumpInputExample() {
  const handleSubmit = (data: { input: string; energyState: string }) => {
    console.log("Brain dump submitted:", data);
  };

  return (
    <div className="p-4">
      <BrainDumpInput onSubmit={handleSubmit} />
    </div>
  );
}