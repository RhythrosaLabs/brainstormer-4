import React, { useState, useCallback } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { Sidebar } from "./components/Sidebar";
import { Chat } from "./components/Chat";
import { ImageEditor } from "./components/ImageEditor";
import { VideoEditor } from "./components/VideoEditor";
import { AudioEditor } from "./components/AudioEditor";
import { ThreeDViewer } from "./components/ThreeDViewer";
import { DocumentEditor } from "./components/DocumentEditor";
import { SpreadsheetEditor } from "./components/SpreadsheetEditor";
import { ChartEditor } from "./components/ChartEditor";
import { CodeEditor } from "./components/CodeEditor";
import { FileManager } from "./components/FileManager";
import { Settings } from "./components/Settings";
import { CommandPalette } from "./components/CommandPalette";
import { Tasks } from "./components/Tasks";
import { Calendar } from "./components/Calendar";
import { Help } from "./components/Help";
import { Whiteboard } from "./components/Whiteboard";
import { storage } from "./utils/storage";
import { BrAInstormerText } from "./components/BrAInstormerText";

export default function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const [apiKeys, setApiKeys] = useState({
    openai: storage.getApiKey("openai") || "",
    stability: storage.getApiKey("stability") || "",
    replicate: storage.getApiKey("replicate") || "",
    anthropic: storage.getApiKey("anthropic") || "",
    luma: storage.getApiKey("luma") || "",
    meta: storage.getApiKey("meta") || ""
  });

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
    storage.setApiKey(provider, value);
  };

  const handleCommand = (command: string) => {
    console.log("Executing command:", command);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <Chat apiKeys={apiKeys} showHistory={true} />;
      case "images":
        return <ImageEditor apiKeys={apiKeys} />;
      case "videos":
        return <VideoEditor />;
      case "audio":
        return <AudioEditor />;
      case "3d":
        return <ThreeDViewer />;
      case "documents":
        return <DocumentEditor />;
      case "spreadsheets":
        return <SpreadsheetEditor />;
      case "charts":
        return <ChartEditor />;
      case "code":
        return <CodeEditor />;
      case "tasks":
        return <Tasks />;
      case "calendar":
        return <Calendar />;
      case "whiteboard":
        return <Whiteboard apiKeys={apiKeys} />;
      case "files":
        return <FileManager />;
      case "help":
        return <Help />;
      case "settings":
        return (
          <Settings
            apiKeys={apiKeys}
            onApiKeyChange={handleApiKeyChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-white">
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </ResizablePanel>

          <ResizableHandle withHandle />
          
          {/* Main Content */}
          <ResizablePanel defaultSize={85}>
            <main className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="h-12 border-b border-[#333] flex items-center px-6">
                  <div className="flex items-center gap-4 w-full">
                    <BrAInstormerText />
                    <div className="flex-1 max-w-2xl">
                      <CommandPalette onCommand={handleCommand} />
                    </div>
                    {activeTab !== "chat" && (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={showChatSidebar}
                          onChange={(e) => setShowChatSidebar(e.target.checked)}
                          className="rounded border-gray-400"
                        />
                        Show Chat
                      </label>
                    )}
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="h-[calc(100vh-3rem)] flex">
                  {activeTab === "chat" ? (
                    // Single chat view when in chat tab
                    <div className="flex-1">
                      <Chat apiKeys={apiKeys} showHistory={true} />
                    </div>
                  ) : (
                    // Content with optional chat sidebar for other tabs
                    <ResizablePanelGroup direction="horizontal">
                      <ResizablePanel defaultSize={showChatSidebar ? 70 : 100}>
                        {renderContent()}
                      </ResizablePanel>
                      {showChatSidebar && (
                        <>
                          <ResizableHandle withHandle />
                          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                            <Chat apiKeys={apiKeys} showHistory={false} />
                          </ResizablePanel>
                        </>
                      )}
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}