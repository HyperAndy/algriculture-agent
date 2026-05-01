import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f8f3] px-6 py-16 text-[#17231b]">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-[#1f6f49]">Field Crop Agent MVP</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          AI驱动的大田作物稳产减灾决策Agent
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#536156]">
          一套数据和Agent能力，两类产品表面：面向评审的宣传演示大屏，面向农技员的管理后台。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-md bg-[#1f6f49] px-5 py-3 font-semibold text-white" href="/demo">
            打开宣传大屏
          </Link>
          <Link className="rounded-md border border-[#b9c8b4] px-5 py-3 font-semibold" href="/console">
            进入管理后台
          </Link>
        </div>
      </div>
    </main>
  );
}
