import dynamic from "next/dynamic";

const NoSSRComponent = dynamic(() => import("../components/KonvaTest"), {
  ssr: false,
});

export default function TestsPage(props: any) {
  return <NoSSRComponent />;
}
