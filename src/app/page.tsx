import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FindSwiftCodeForm } from "@/components/find-swift-code-form";
import { CheckSwiftCodeForm } from "@/components/check-swift-code-form";
import { Logo } from "@/components/icons";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Logo className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">
            SwiftCode V3
          </h1>
          <p className="text-muted-foreground mt-2">
            Your reliable tool for finding and verifying SWIFT/BIC codes worldwide.
          </p>
        </div>
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
