import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  TextField,
  Button,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Search as SearchIcon,
  GroupAdd as GroupAddIcon,
  Group as GroupIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';

const drawerWidth = 300;

export default function Chat() {
  const { currentUser, logout } = useAuth();
  const {
    socket,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    messages,
    setMessages,
    notification,
    setNotification,
  } = useSocket();
  
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch user's chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get('/api/chats');
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages when a chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      
      try {
        const { data } = await axios.get(`/api/messages/${selectedChat._id}`);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle search for users
  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/users?search=${query}`);
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage || !selectedChat) return;

    try {
      const { data } = await axios.post('/api/messages', {
        content: newMessage,
        chatId: selectedChat._id,
      });
      
      setMessages([...messages, data]);
      setNewMessage('');
      
      // Emit socket event
      if (socket) {
        socket.emit('new message', data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle user selection for group chat
  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Create a new group chat
  const createGroupChat = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      alert('Please select at least 2 users and provide a group name');
      return;
    }

    try {
      const { data } = await axios.post('/api/chats/group', {
        name: groupChatName,
        users: selectedUsers,
      });
      
      setChats([data, ...chats]);
      setSelectedChat(data);
      setOpenGroupDialog(false);
      setGroupChatName('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating group chat:', error);
    }
  };

  // Render the chat drawer
  const drawer = (
    <div>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" noWrap component="div">
          Chat App
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GroupAddIcon />}
          sx={{ mt: 2 }}
          onClick={() => setOpenGroupDialog(true)}
        >
          New Group Chat
        </Button>
      </Box>
      <Divider />
      <List>
        {chats.map((chat) => (
          <ListItem key={chat._id} disablePadding>
            <ListItemButton
              selected={selectedChat?._id === chat._id}
              onClick={() => {
                setSelectedChat(chat);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>
                {chat.isGroupChat ? (
                  <GroupIcon />
                ) : (
                  <Avatar>
                    {chat.users.find((u) => u._id !== currentUser?._id)?.name[0]}
                  </Avatar>
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  chat.isGroupChat
                    ? chat.chatName
                    : chat.users.find((u) => u._id !== currentUser?._id)?.name
                }
                secondary={
                  chat.latestMessage
                    ? `${chat.latestMessage.sender.name}: ${chat.latestMessage.content.substring(0, 20)}...`
                    : 'No messages yet'
                }
              />
              {notification?.chat._id === chat._id && (
                <Badge color="primary" variant="dot" />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {selectedChat
              ? selectedChat.isGroupChat
                ? selectedChat.chatName
                : selectedChat.users.find((u) => u._id !== currentUser?._id)?.name
              : 'Select a chat'}
          </Typography>
          <div>
            <Tooltip title="Account">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="large"
                color="inherit"
              >
                <Avatar>
                  {currentUser?.name?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
        }}
      >
        {selectedChat ? (
          <>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message._id}
                  sx={{
                    display: 'flex',
                    justifyContent:
                      message.sender._id === currentUser?._id
                        ? 'flex-end'
                        : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor:
                        message.sender._id === currentUser?._id
                          ? 'primary.main'
                          : 'grey.300',
                      color:
                        message.sender._id === currentUser?._id
                          ? 'white'
                          : 'text.primary',
                      p: 1.5,
                      borderRadius: 2,
                      maxWidth: '70%',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {message.sender.name}
                    </Typography>
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography variant="caption" display="block" sx={{ textAlign: 'right' }}>
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" variant="contained" color="primary">
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6">Select a chat to start messaging</Typography>
          </Box>
        )}
      </Box>

      {/* Group Chat Dialog */}
      <Dialog
        open={openGroupDialog}
        onClose={() => setOpenGroupDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Group Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            type="text"
            fullWidth
            variant="outlined"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            placeholder="Search users..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              searchResults.map((user) => (
                <Box
                  key={user._id}
                  onClick={() => handleUserToggle(user._id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    bgcolor: selectedUsers.includes(user._id)
                      ? 'action.selected'
                      : 'transparent',
                  }}
                >
                  <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
                  <Box>
                    <Typography>{user.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGroupDialog(false)}>Cancel</Button>
          <Button onClick={createGroupChat} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
