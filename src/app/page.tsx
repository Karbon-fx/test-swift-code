
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FindSwiftCodeFormContent } from "@/components/find-swift-code-form";
import { CheckSwiftCodeFormContent } from "@/components/check-swift-code-form";
import { Info } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-0">
      <div className="w-full max-w-md">
        <Tabs defaultValue="find" className="w-full">
          <Card className="w-full shadow-sm flex flex-col bg-tool-background">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="find">Find SWIFT code</TabsTrigger>
                <TabsTrigger value="check">Check SWIFT code</TabsTrigger>
              </TabsList>
            </CardHeader>
            <TabsContent value="find" className="mt-0">
              <FindSwiftCodeFormContent />
            </TabsContent>
            <TabsContent value="check" className="mt-0">
               <CheckSwiftCodeFormContent />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </main>
  );
}
