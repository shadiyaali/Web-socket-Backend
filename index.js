const { Server } = require("socket.io");

const io = new Server(9000,{
    cors:true
})


const emailToSocketIdMap = new Map()
const socketidToEmailMap = new Map()

io.on("connection",(socket)=>{
    console.log(`Soket Connected`,socket.id);
    socket.on("room:join",data=>{
        const {Email,Room} = data
        emailToSocketIdMap.set(Email,socket.id)
        socketidToEmailMap.set(socket.id,Email)
        io.to(Room).emit("user:joined",{Email,id:socket.id})
        socket.join(Room)
        io.to(socket.id).emit("room:join",data)     
    });
    socket.on("user:call",({to,offer})=>{
        io.to(to).emit("incoming:call",{from:socket.id,offer});
    })
    socket.on("call:accepted",({to,ans})=>{
        io.to(to).emit("call:accepted",{from:socket.id,ans});
    })
    socket.on("peer:nego:needed",({to,offer})=>{
        io.to(to).emit("peer:nego:needed",{from:socket.id,offer});
    })
    socket.on("peer:nego:done",({to,ans})=>{
        io.to(to).emit("peer:nego:final",{from:socket.id,ans});
})

})