import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function TabsTest() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Tabs Test Page (Uncontrolled)</h1>

      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>

        <TabsContent value="tab1">
          <Card className="p-6">
            <h2 className="text-xl font-bold">Tab 1 Content</h2>
            <p>This is the content for tab 1.</p>
          </Card>
        </TabsContent>

        <TabsContent value="tab2">
          <Card className="p-6">
            <h2 className="text-xl font-bold">Tab 2 Content</h2>
            <p>This is the content for tab 2.</p>
          </Card>
        </TabsContent>

        <TabsContent value="tab3">
          <Card className="p-6">
            <h2 className="text-xl font-bold">Tab 3 Content</h2>
            <p>This is the content for tab 3.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
