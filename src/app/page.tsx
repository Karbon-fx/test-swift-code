import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FindSwiftCodeForm } from "@/components/find-swift-code-form";
import { CheckSwiftCodeForm } from "@/components/check-swift-code-form";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl">
        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="find">Find SWIFT Code</TabsTrigger>
            <TabsTrigger value="check">Check SWIFT Code</TabsTrigger>
          </TabsList>
          <TabsContent value="find">
            <FindSwiftCodeForm />
          </TabsContent>
          <TabsContent value="check">
            <CheckSwiftCodeForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
