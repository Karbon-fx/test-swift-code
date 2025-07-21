import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FindSwiftCodeForm, FindSwiftCodeFormContent } from "@/components/find-swift-code-form";
import { CheckSwiftCodeForm, CheckSwiftCodeFormContent } from "@/components/check-swift-code-form";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      <div className="w-full max-w-2xl">
        <Tabs defaultValue="find" className="w-full">
          <Card className="w-full shadow-sm">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="find">Find SWIFT Code</TabsTrigger>
                <TabsTrigger value="check">Check SWIFT Code</TabsTrigger>
              </TabsList>
            </CardHeader>
            <TabsContent value="find">
              <FindSwiftCodeFormContent />
            </TabsContent>
            <TabsContent value="check">
              <CheckSwiftCodeFormContent />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </main>
  );
}
