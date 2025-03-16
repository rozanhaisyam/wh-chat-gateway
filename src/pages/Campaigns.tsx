
import { useState } from "react";
import { 
  Plus, 
  Calendar, 
  Filter, 
  Search, 
  MoreVertical,
  Trash,
  Pause,
  Play,
  Copy,
  FileText,
  Users,
  Check,
  X,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { mockCampaigns } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const getCampaignStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return <Play className="h-4 w-4 text-green-500" />;
    case 'scheduled':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'completed':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <X className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const Campaigns = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateCampaign = () => {
    toast({
      title: "Coming soon",
      description: "Campaign creation will be available soon."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">
            Create and manage your messaging campaigns
          </p>
        </div>
        <Button onClick={handleCreateCampaign}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {campaign.message}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCampaignStatusIcon(campaign.status)}
                        <Badge 
                          variant={campaign.status === 'draft' ? 'outline' : 'secondary'}
                          className="capitalize"
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.recipientCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress 
                          value={campaign.sentCount / campaign.recipientCount * 100} 
                          className="h-2" 
                        />
                        <div className="text-xs text-muted-foreground">
                          <span className="text-foreground font-medium">
                            {campaign.sentCount}
                          </span>
                          /{campaign.recipientCount} sent (
                          <span className="text-green-500">
                            {campaign.deliveredCount} delivered
                          </span>
                          , <span className="text-blue-500">
                            {campaign.readCount} read
                          </span>
                          , <span className="text-red-500">
                            {campaign.failedCount} failed
                          </span>
                          )
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                      {campaign.scheduledFor && (
                        <div className="text-xs text-muted-foreground">
                          Scheduled: {new Date(campaign.scheduledFor).toLocaleString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {campaign.status === 'running' ? (
                            <DropdownMenuItem>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause Campaign
                            </DropdownMenuItem>
                          ) : campaign.status === 'draft' || campaign.status === 'scheduled' ? (
                            <DropdownMenuItem>
                              <Play className="mr-2 h-4 w-4" />
                              {campaign.status === 'draft' ? 'Start' : 'Resume'} Campaign
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {mockCampaigns.length} campaigns
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Campaigns;
