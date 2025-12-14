# Notification System Documentation

## Overview
The notification system in LoanMitra provides real-time notifications for both admin and user actions related to loan management. It uses Server-Sent Events (SSE) for real-time communication and browser notifications for immediate user feedback.

## Features

### Real-time Notifications
- **SSE Connection**: Establishes persistent connection for real-time updates
- **Browser Notifications**: Shows desktop notifications when permission is granted
- **Sound Alerts**: Plays notification sound for new notifications
- **Visual Indicators**: Bell icon with unread count in header

### Notification Types

#### For Users:
1. **Loan Request Submitted** 📋
   - Triggered when user submits a loan request
   - Confirms request was received and is pending approval

2. **Loan Approved** 🎉
   - Triggered when admin approves a loan request
   - Informs user their request is now active

3. **Loan Rejected** ❌
   - Triggered when admin rejects a loan request
   - Includes rejection reason if provided

4. **Item Due Soon** 📅
   - Triggered 24 hours before loan end date
   - Reminds user to prepare for return

5. **Item Overdue** ⚠️
   - Triggered when loan end date has passed
   - Urges user to return item immediately

6. **Item Returned Successfully** ✅
   - Triggered when item is returned
   - Confirms successful return

7. **Welcome Back** 👋
   - Triggered on user login
   - Welcomes user back to the system

#### For Admins:
1. **New Loan Request** 📋
   - Triggered when any user submits a loan request
   - Shows user name and requested item

2. **Item Returned** 📦
   - Triggered when any user returns an item
   - Shows user name and returned item

3. **Item Overdue** ⚠️
   - Triggered when any item becomes overdue
   - Shows user name and overdue item

## Technical Implementation

### Backend (Node.js/Express)
- **SSE Endpoint**: `/api/notifications/stream?userId={userId}`
- **Connection Management**: Uses Map to store active SSE connections
- **Notification Sending**: `sendNotificationToUser()` function
- **Scheduled Checks**: Hourly check for overdue/due soon loans

### Frontend (React/TypeScript)
- **useNotifications Hook**: Manages SSE connection and notification state
- **Header Component**: Displays notification bell with unread count
- **Notification Display**: Dropdown with all notifications
- **Browser Integration**: Requests and uses browser notification API

### Database
- **Real-time**: Notifications are sent immediately without database storage
- **SSE Connection**: Maintains active connections for instant delivery

## Usage Examples

### Testing Notifications
1. **Login**: User receives welcome notification
2. **Request Loan**: User gets confirmation, admin gets new request notification
3. **Approve/Reject**: User gets approval/rejection notification
4. **Return Item**: User gets return confirmation, admin gets return notification
5. **Overdue Check**: Automatic hourly check for overdue items

### Manual Testing
- Use the test notification feature in Settings → Test Notifications
- Send test notifications to verify system functionality

## Configuration

### Notification Settings
- **Email Notifications**: Future enhancement
- **Push Notifications**: Browser notifications when permission granted
- **Sound Alerts**: Automatic sound for new notifications
- **Visual Indicators**: Always active

### Scheduling
- **Overdue Check**: Every hour
- **Due Soon Check**: Every hour (24 hours before due date)
- **Initial Check**: 5 seconds after server start

## Security Considerations
- **User-specific**: Notifications only sent to intended user
- **SSE Security**: Connections tied to user ID
- **Permission-based**: Browser notifications require user permission

## Future Enhancements
1. **Email Notifications**: Send email notifications for important events
2. **SMS Notifications**: Send SMS for critical overdue items
3. **Notification Preferences**: Allow users to customize notification types
4. **Notification History**: Store notifications in database for history
5. **Bulk Notifications**: Send notifications to multiple users at once

## Troubleshooting

### Common Issues
1. **No Notifications**: Check SSE connection in browser console
2. **Missing Browser Notifications**: Check notification permission
3. **Sound Not Working**: Check browser audio settings
4. **Connection Errors**: Check server logs for SSE errors

### Debug Steps
1. Open browser console and look for SSE connection logs
2. Check notification permission in browser settings
3. Test with manual notification in Settings
4. Verify server is running and accessible
