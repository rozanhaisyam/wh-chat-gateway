
import { useState } from "react";
import { 
  Send, 
  Image, 
  Paperclip, 
  RefreshCw,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDevices, mockContacts, mockMessages } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Message required",
        description: "Please enter a message to send",
      });
      return;
    }

    if (!selectedDevice) {
      toast({
        variant: "destructive",
        title: "Device required",
        description: "Please select a device to send from",
      });
      return;
    }

    if (selectedContacts.length === 0) {
      toast({
        variant: "destructive",
        title: "Recipients required",
        description: "Please select at least one recipient",
      });
      return;
    }

    toast({
      title: "Message sent",
      description: `Message sent to ${selectedContacts.length} recipient(s)`,
    });
    
    setMessage("");
  };

  const connectedDevices = mockDevices.filter(
    (device) => device.status === "connected"
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          Send and manage WhatsApp messages
        </p>
      </div>

      <Tabs defaultValue="single">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="single">Single Message</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Message</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>
                  Send a message to a single contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Device</label>
                  <Select
                    value={selectedDevice}
                    onValueChange={setSelectedDevice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                    <SelectContent>
                      {connectedDevices.length > 0 ? (
                        connectedDevices.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name} ({device.phoneNumber})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No connected devices
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">To Contact</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockContacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} ({contact.phoneNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Type your message here..."
                    className="min-h-[120px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button size="icon" variant="outline">
                    <Image size={16} />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Paperclip size={16} />
                  </Button>
                </div>
                <Button onClick={handleSendMessage}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message History</CardTitle>
                <CardDescription>
                  Recent messages sent and received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-8" />
                </div>
                <div className="space-y-4">
                  {mockMessages.map((msg) => {
                    const contact = mockContacts.find(
                      (c) => c.phoneNumber === msg.sender || c.phoneNumber === msg.recipient
                    );
                    const isSent = msg.sender !== contact?.phoneNumber;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`p-3 rounded-lg border flex gap-3 ${
                          isSent ? 'bg-accent' : ''
                        }`}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={contact?.avatar} />
                          <AvatarFallback>
                            {contact?.name.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-sm">
                              {contact?.name || 'Unknown'}
                            </p>
                            <Badge variant={isSent ? 'outline' : 'secondary'} className="text-xs">
                              {isSent ? msg.status : 'Received'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {msg.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(msg.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Load More
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bulk" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Message</CardTitle>
              <CardDescription>
                Send the same message to multiple contacts at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Device</label>
                <Select
                  value={selectedDevice}
                  onValueChange={setSelectedDevice}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectedDevices.length > 0 ? (
                      connectedDevices.map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name} ({device.phoneNumber})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No connected devices
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Recipients</label>
                <div className="border rounded-md p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search contacts..." className="pl-8" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                    {mockContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className="flex items-center gap-2 p-2 border rounded-md hover:bg-accent cursor-pointer"
                        onClick={() => {
                          if (selectedContacts.includes(contact.id)) {
                            setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                          } else {
                            setSelectedContacts([...selectedContacts, contact.id]);
                          }
                        }}
                      >
                        <div className={`w-4 h-4 border rounded ${
                          selectedContacts.includes(contact.id) 
                            ? 'bg-whatsapp border-whatsapp' 
                            : 'border-gray-300'
                        }`} />
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium truncate">{contact.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {contact.phoneNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                    <span>
                      {selectedContacts.length} contact(s) selected
                    </span>
                    <button 
                      className="text-whatsapp hover:underline"
                      onClick={() => setSelectedContacts([])}
                    >
                      Clear selection
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button size="icon" variant="outline">
                  <Image size={16} />
                </Button>
                <Button size="icon" variant="outline">
                  <Paperclip size={16} />
                </Button>
              </div>
              <Button onClick={handleSendMessage}>
                <Send className="mr-2 h-4 w-4" />
                Send to {selectedContacts.length} Contact{selectedContacts.length !== 1 ? 's' : ''}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
