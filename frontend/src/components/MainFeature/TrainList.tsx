import {  FaAngleDown, FaAngleUp, FaLocationArrow } from 'react-icons/fa';
import { VscLocation } from "react-icons/vsc";
import { format } from 'date-fns';
import { useEffect, useState } from 'react'
import { BackgroundBeams } from '../ui/background-beams'
import { Label } from "../ui/label";
import { cn } from "@/utils/cn";
import logo from "../../assets/icon.svg"
import { ArrowLeftRightIcon, CalendarIcon,  Clock,  EllipsisVerticalIcon,  GripVerticalIcon,  LogOut, Menu,  User2Icon } from 'lucide-react';
import { Button } from '../ui/moving-border';
import { Button as Button1}  from '../ui/button';
import { motion } from 'framer-motion';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Calendar } from '../ui/calendar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
type T1 = {
    value: string
    label: string
  }
  const Classes:T1[] = [
    {
      value: "all",
      label: "All Classes",
    },
    {
      value: "1a",
      label: "AC First Class (1A)",
    },
    {
      value: "2a",
      label: "AC 2 Tier (2A)",
    },
    {
      value: "3a",
      label: "AC 3 Tier (3A)",
    },
    {
      value: "sleeper",
      label: "Sleeper",
    },
  ]
  const Coaches :T1[]= [
    {
      value: "general",
      label: "General",
    },
    {
      value: "ladies",
      label: "Ladies",
    },
    {
      value: "tatkal",
      label: "Tatkal",
    },
    {
      value: "lowerbirth",
      label: "Lower Berth",
    },
    {
      value: "pwd",
      label: "Person with Disability",
    },
  ]
  type T2 = {
    trainNumber: number
    from: number
    to: number
    fromTime: string
    toTime: string
    availableSeats: number
  }
const TrainList = () => {
  const location = useLocation();
    const [trainList, setTrainList] = useState<T2[]>([])
    const [filter1,setFilter1]=useState(false);
    const [stationsList, setStationsList] = useState<T1[]>([{
      value: "1",
      label: "station1",
    },
    {
      value: "2",
      label: "station2",
    },]);
    const [opens1, setOpens1] = useState(false)
    const [stvalue1, setStValue1] = useState<T1 | null>(null)
    const [opens2, setOpens2] = useState(false)
    const [stvalue2, setStValue2] = useState<T1 | null>(null)
    const [showDiv,setShowDiv]=useState(false);
    const [open1, setOpen1] = useState(false)
    const [value1, setValue1] = useState<T1 | null>(null)
    const [open2, setOpen2] = useState(false)
    const [value2, setValue2] = useState<T1 | null>(null)
    const [date, setDate] = useState<Date>()
    const formattedDate = date ? `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` : '';
    useEffect(() => {  
      const ress= location.state;
        if(ress)
          {
            console.log(ress);
            if(ress.from && !stvalue1){setStValue1(ress.from);}
            if(ress.to && !stvalue2){setStValue2(ress.to);}
            if(ress.date && !date){setDate(ress.date);}
            if(ress.coach && !value1){setValue1(ress.coach);}
            if(ress.class && !value2 ){setValue2(ress.class);}
          }
        axios.get('http://localhost:3000/api/v1/admin/stationdb')
        .then(response => {
          const tmp=[];
          for(let i=0;i<response.data.data.length;i++){
            tmp.push({value: response.data.data[i].stationNumber.toString(), label: response.data.data[i].stationName});
          }
          setStationsList(tmp);
        })
        .catch(error => {
            console.log( error.message );
        });
        const searcData = { 'from': parseInt(stvalue1?.value || '0'), 'to': parseInt(stvalue2?.value || '0'), 'date': formattedDate===''?"1-1-2000":formattedDate};
        console.log(searcData);
        axios.post('http://localhost:3000/api/v1/search/searchTrain',searcData)
        .then(response => {
          // console.log(response.data.trains);
          setTrainList(response.data.trains);
        })
        .catch(error => {
            console.log( error.message );
        });


        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Escape") {
            setShowDiv(false);
          }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }, [stvalue1,stvalue2,date]);
        const swapST = () => {
          const temp = stvalue1;
          setStValue1(stvalue2);
          setStValue2(temp);
        }
      
  return (
    <div className='overflow-x-hidden'>
    <motion.div className='h-[200rem] w-screen flex flex-col justify-center items-center z-0 top-0 left-0 opacity-60 space-y-8 px-4'
    onClick={()=>{showDiv?setShowDiv(false):null}}
    initial={{ opacity: 1}}
    animate={{ opacity: showDiv ? 0.6:1}}
    transition={{ duration: 0.5 }}    
    >
        <div className='h-16 w-screen bg-zinc-400 flex flex-row items-center justify-between px-6'>
            <a href='/'><img src={logo} className='h-8 w-8 '/></a>
            <Menu className='border-2 border-zinc-800 rounded h-8 w-8 cursor-pointer z-10' onClick={()=>{setShowDiv(!showDiv)}}/>
        </div>
        <div className='h-36 w-full border-2 border-zinc-100 rounded pt-2 m-2 px-6 flex flex-col'>
          <div className='flex flex-row justify-center items-center p-2 space-x-4'>
          <div className='flex flex-col space-y-2'>
            <Label className='text-white'>From</Label>
            <Popover open={opens1} onOpenChange={setOpens1}>
              <PopoverTrigger asChild>
                <Button1 variant="outline" className="w-[150px] justify-start bg-white hover:bg-white rounded p-0">
                <div className="space-x-2 flex flex-row">
                    <FaLocationArrow color="black" className="mt-1 ml-2 mr-2"/>
                    {stvalue1 ? <>{stvalue1.label}</> : <h1>From</h1>}
                </div>
                </Button1>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-white" side="bottom" align="start">
                <Command>
                  <CommandInput placeholder="Choose station..." />
                  <CommandList className="bg-gray-200">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {stationsList.map((station) => (
                        <CommandItem
                          key={station.value}
                          value={station.value}
                          onSelect={(value) => {
                            setStValue1(
                              stationsList.find((priority) => priority.value === value) ||
                                null
                            )
                            setOpens1(false)
                          }}
                        >
                          {station.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            </div>
            <ArrowLeftRightIcon className='h-6 w-6 text-black mt-4 cursor-pointer bg-zinc-200 rounded px-0 mx-0' onClick={swapST}/>
            <div className='flex flex-col space-y-2'>
            <Label className='text-white pl-0 ml-0'>To</Label>
            <Popover open={opens2} onOpenChange={setOpens2}>
              <PopoverTrigger asChild>
                <Button1 variant="outline" className="w-[150px] justify-start bg-white hover:bg-white rounded p-0">
                    <div className="space-x-1 flex flex-row">
                    <VscLocation color="black" className="pl-1 h-6 w-6 mr-1"/>
                    {stvalue2 ? <>{stvalue2.label}</> : <h1>To</h1>}
                    </div>
                </Button1>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-white" side="bottom" align="start">
                <Command>
                  <CommandInput placeholder="Choose station..." />
                  <CommandList className="bg-gray-200">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {stationsList.map((station) => (
                        <CommandItem
                          key={station.value}
                          value={station.value}
                          onSelect={(value) => {
                            setStValue2(
                              stationsList.find((priority) => priority.value === value) ||
                                null
                            )
                            setOpens2(false)
                          }}
                        >
                          {station.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            </div>
            <div className='w-4'></div>
          <div className='flex flex-col space-y-2'>
            <Label className='text-white'>Coaches</Label>
            <Popover open={open2} onOpenChange={setOpen2}>
              <PopoverTrigger asChild>
                <Button1 variant="outline" className="w-[150px] justify-start bg-white hover:bg-white rounded">
                  {value2 ? <>{value2.label}</> : <>Classes</>}
                </Button1>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-white" side="bottom" align="start">
                <Command>
                  <CommandInput placeholder="Change coach..." />
                  <CommandList className="bg-gray-200">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {Classes.map((classe) => (
                        <CommandItem
                          key={classe.value}
                          value={classe.value}
                          onSelect={(value) => {
                            setValue2(
                              Classes.find((priority) => priority.value === value) ||
                                null
                            )
                            setOpen2(false)
                          }}
                        >
                          {classe.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            </div>
            <div className='flex flex-col space-y-2'>
            <Label className='text-white'>Coaches</Label>
            <Popover open={open1} onOpenChange={setOpen1}>
              <PopoverTrigger asChild>
                <Button1 variant="outline" className="w-[150px] justify-start bg-white hover:bg-white rounded">
                  {value1 ? <>{value1.label}</> : <>Coaches</>}
                </Button1>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-white" side="bottom" align="start">
                <Command>
                  <CommandInput placeholder="Change coach..." />
                  <CommandList className="bg-gray-200">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {Coaches.map((coach) => (
                        <CommandItem
                          key={coach.value}
                          value={coach.value}
                          onSelect={(value) => {
                            setValue1(
                              Coaches.find((priority) => priority.value === value) ||
                                null
                            )
                            setOpen1(false)
                          }}
                        >
                          {coach.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            </div>
            <div className='flex flex-col space-y-2'>
            <Label className='text-white'>Date</Label>
            <Popover>
            <PopoverTrigger asChild>
              <Button1
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal bg-white hover:bg-white rounded",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button1>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="bg-white"
              />
            </PopoverContent>
            </Popover>
            </div>
            <Button1 className='bg-blue-500 rounded-xl hover:bg-blue-400 w-40 font-serif text-md items-center justify-center mt-5'>Modify Search</Button1>
          </div>
          <div className='flex flex-row justify-between items-center m-4 space-x-4 px-12'>
            <div className='space-x-4'><Checkbox className='text-white border-white'/><Label className='text-white'>Person With Disability Concession</Label></div>
            <div className='space-x-4'><Checkbox className='text-white border-white'/><Label className='text-white'>Flexible With Date</Label></div>
            <div className='space-x-4'><Checkbox className='text-white border-white'/><Label className='text-white'>Train with Available Berth</Label></div>
            <div className='space-x-4'><Checkbox className='text-white border-white'/><Label className='text-white'>Railway Pass Concession</Label></div>
            <div className='w-32'></div>
          </div>
        </div>
        <div className='flex flex-row w-full h-full'>
            <div className='w-1/4 h-[100rem] bg-emerald-100 justify-start l-0 flex flex-col'>
                <div className='flex flex-row justify-between px-4 pt-3'>
                    <h1 className='font-mono pt-1'>Refine Results</h1>
                    <Button1 className='rounded m-0 bg-orange-200 hover:bg-orange-100  text-md top-0 h-7 p-3'>Reset</Button1>
                </div>
                <div className='border-t border-zinc-800 my-2'></div>
                <div className='flex flex-row justify-between px-2 pt-2'>
                    <h1 className='font-medium pt-1'>Departure Time</h1>
                    <Button1 className='rounded m-0 bg-orange-200 hover:bg-orange-100  text-md top-0 h-7 p-3'>All</Button1>
                    <Button1 className='rounded m-0 bg-orange-200 hover:bg-orange-100  text-md top-0 h-7 p-3' onClick={()=>{setFilter1(!filter1);}}>{filter1?<FaAngleDown /> : <FaAngleUp />}</Button1>
                </div>
                <div className='border-t border-zinc-800 mt-3'></div>
                    <motion.div className='w-full bg-white z-10 flex flex-col mt-2' 
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: filter1 ? 1 : 0, height: filter1 ? 80 : 0, overflow: 'hidden' }}
                    transition={{ duration: 0.5 }}
                    ></motion.div>
                <div className='flex flex-row justify-between px-2 pt-2'>
                    <h1 className='font-medium pt-1'>Departure Time</h1>
                    <Button1 className='rounded m-0 bg-orange-200 hover:bg-orange-100  text-md top-0 h-7 p-3'>All</Button1>
                    <Button1 className='rounded m-0 bg-orange-200 hover:bg-orange-100  text-md top-0 h-7 p-3' onClick={()=>{setFilter1(!filter1);}}>{filter1?<FaAngleDown /> : <FaAngleUp />}</Button1>
                </div>
                <div className='border-t border-zinc-800 mt-3'></div>
                    <motion.div className='w-full bg-white z-10 flex flex-col mt-2' 
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: filter1 ? 1 : 0, height: filter1 ? 80 : 0, overflow: 'hidden' }}
                    transition={{ duration: 0.5 }}
                    ></motion.div>
                    <div className='flex flex-row justify-between px-2 pt-2'>
                    <h1 className='font-medium pt-1'>Departure Time</h1>
                    <Button1 className='rounded m-0 bg-orange-200 hover:bg-orange-100  text-md top-0 h-7 p-3'>All</Button1>
                    <Button1 className='rounded m-0 bg-orange-200 hover:bg-orange-100  text-md top-0 h-7 p-3' onClick={()=>{setFilter1(!filter1);}}>{filter1?<FaAngleDown /> : <FaAngleUp />}</Button1>
                </div>
                <div className='border-t border-zinc-800 mt-3'></div>
                    <motion.div className='w-full bg-white z-10 flex flex-col mt-2' 
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: filter1 ? 1 : 0, height: filter1 ? 80 : 0, overflow: 'hidden' }}
                    transition={{ duration: 0.5 }}
                    ></motion.div>
                    <div className='flex flex-row justify-between px-2 pt-2'>
                    <h1 className='font-medium pt-1'>Departure Time</h1>
                    <Button1 className='rounded m-0 bg-orange-200 hover:bg-orange-100  text-md top-0 h-7 p-3'>All</Button1>
                    <Button1 className='rounded m-0 bg-orange-200 hover:bg-orange-100  text-md top-0 h-7 p-3' onClick={()=>{setFilter1(!filter1);}}>{filter1?<FaAngleDown /> : <FaAngleUp />}</Button1>
                </div>
                <div className='border-t border-zinc-800 mt-3'></div>
                    <motion.div className='w-full bg-white z-10 flex flex-col mt-2' 
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: filter1 ? 1 : 0, height: filter1 ? 80 : 0, overflow: 'hidden' }}
                    transition={{ duration: 0.5 }}
                    ></motion.div>
                {/*<div className='border-t border-zinc-800 mt-3'></div>*/}
            </div>
            <div className='flex flex-col space-y-4'>
            {trainList.map((train) => (
            <div className='w-full h-52 bg-white m-2 flex flex-col'>
                <div className='flex flex-row bg-teal-300 justify-between'>
                    <div className='flex flex-row px-2'>
                        <h1 className='p-1 font-serif text-lg font-black'>Train Name</h1>
                        <h1 className='p-1 font-serif text-lg font-black'>{train.trainNumber}</h1>
                    </div>
                    <div className='flex flex-row px-2 my-auto w-60'>
                        <h1>Runs On days</h1>
                    </div>
                    <div className='flex flex-row px-2 my-auto'>
                        <button className=' text-blue-600 hover:text-blue-800 '><h1 className='font-bold'>Train Schedule</h1></button>
                    </div>
                </div>
                <div className='flex flex-row bg-emerald-50 justify-between items-center h-64'>
                    <div className='flex flex-row px-2'>
                        <Clock className='h-5 w-5 mt-2'/>
                        <h1 className='p-1 font-serif text-lg font-black'>{train.fromTime}</h1>
                        <EllipsisVerticalIcon className='h-6 w-6 mt-2'/>
                        <VscLocation className='h-5 w-5 mt-2'/>
                        <h1 className='p-1 font-serif text-lg font-black'>{train.from}</h1>
                        <EllipsisVerticalIcon className='h-6 w-6 mt-2'/>
                        <CalendarIcon className='h-5 w-5 mt-2'/>
                        <h1 className='p-1 font-serif text-lg font-black'>DP:Date</h1>
                    </div>
                    <div className='flex flex-row px-2 my-auto '>
                        <GripVerticalIcon className='h-6 w-6 mt-2'/>
                        <h1 className='p-1 font-serif text-lg font-black'>Jr:Tm</h1>
                        <GripVerticalIcon className='h-6 w-6 mt-2'/>
                    </div>
                    <div className='flex flex-row px-2 my-auto'>
                    <Clock className='h-5 w-5 mt-2'/>
                        <h1 className='p-1 font-serif text-lg font-black'>{train.toTime}</h1>
                        <EllipsisVerticalIcon className='h-6 w-6 mt-2'/>
                        <VscLocation className='h-5 w-5 mt-2'/>
                        <h1 className='p-1 font-serif text-lg font-black'>{train.to}</h1>
                        <EllipsisVerticalIcon className='h-6 w-6 mt-2'/>
                        <CalendarIcon className='h-5 w-5 mt-2'/>
                        <h1 className='p-1 font-serif text-lg font-black'>Ar:Date</h1>
                    </div>
                </div>
                <div className='flex flex-row bg-white justify-start'>
                    <div className='flex flex-col px-2 rounded border-2 border-zinc-800 m-4 bg-zinc-200'>
                        <h1 className='px-1 font-mono text-lg font-black'>Sleeper (SL)</h1>
                        <h1>{train.availableSeats}</h1>
                    </div>
                    <div className='flex flex-col px-2 rounded border-2 border-zinc-800 m-4 bg-zinc-200'>
                        <h1 className='px-1 font-mono text-lg font-black'>Sleeper (SL)</h1>
                        <h1>Av.Seat</h1>
                    </div>
                    <div className='flex flex-col px-2 rounded border-2 border-zinc-800 m-4 bg-zinc-200'>
                        <h1 className='px-1 font-mono text-lg font-black'>Sleeper (SL)</h1>
                        <h1>Av.Seat</h1>
                    </div>
                    <div className='flex flex-col px-2 rounded border-2 border-zinc-800 m-4 bg-zinc-200'>
                        <h1 className='px-1 font-mono text-lg font-black'>Sleeper (SL)</h1>
                        <h1>Av.Seat</h1>
                    </div>
                    <div className='flex flex-col px-2 rounded border-2 border-zinc-800 m-4 bg-zinc-200'>
                        <h1 className='px-1 font-mono text-lg font-black'>Sleeper (SL)</h1>
                        <h1>Av.Seat</h1>
                    </div>
                </div>
                <div className='flex flex-row bg-gray-200 justify-start'>
                    <div className='flex flex-row p-2'>
                        <Button1 className='bg-orange-600 rounded-xl hover:bg-orange-500 w-40 font-serif text-lg'>Book Now</Button1>
                    </div>
                    
                </div>
            </div>))}
          </div>
        </div>
    </motion.div>
    <motion.div className='h-screen w-1/4 bg-white z-10 top-0 right-0 fixed flex flex-col ' 
    initial={{ opacity: 0, left: screen.width }}
    animate={{ opacity: showDiv ? 1 : 0, left: showDiv ? screen.width*3/4:screen.width }}
    transition={{ duration: 0.5 }}
    >
      <div className='flex flex-row w-full bg-zinc-800 h-24 p-2 items-center'>
        <User2Icon className='h-8 w-8 m-6' color='white'/>
        <Button className='bg-[#bdfbc] font-serif text-white border border-zinc-700'>My Profile</Button>
      </div>
      <div className='flex flex-row items-center justify-center p-3'><Button1 className='bg-blue-600 rounded-xl hover:bg-blue-500 w-40 font-serif text-lg'>Home Page</Button1></div>
      <div className='h-2 border-t-2 border-zinc-200 mt-1'></div>
      <div className='flex flex-row items-center justify-start p-2'><a href='/' className='pl-2 w-40 font-serif text-lg hover:underline text-blue-500 underline'>Book Tickets</a></div>
      <div className='h-2 border-t-2 border-zinc-200 mt-1'></div>
      <div className='flex flex-row items-center justify-start p-2'><a href='/' className='pl-2 w-40 font-serif text-lg hover:underline'>Search Trains</a></div>
      <div className='h-2 border-t-2 border-zinc-200 mt-1'></div>
      <div className='flex flex-row items-center justify-start p-2'><a href='/' className='pl-2 w-40 font-serif text-lg hover:underline'>Search Stations</a></div>
      <div className='h-2 border-t-2 border-zinc-200 mt-1'></div>
      <div className='flex flex-row items-center justify-start p-2'><a href='/' className='pl-2 w-40 font-serif text-lg hover:underline'>PNR Enquiry</a></div>
      <div className='h-2 border-t-2 border-zinc-200 mt-1'></div>
      <div className='flex flex-row items-center justify-start p-2'><a href='/' className='pl-2 w-40 font-serif text-lg hover:underline'>Passenger List</a></div>
      <div className='h-2 border-t-2 border-zinc-200 mt-1'></div>
      <div className='flex flex-row items-center justify-start p-2'><a href='/' className='pl-2 w-40 font-serif text-lg hover:underline'>Change Password</a></div>
      <div className='h-2 border-t-2 border-zinc-200 mt-1'></div>
      <div className='flex flex-row items-center justify-center p-2'><Button1 className='bg-blue-600 rounded-xl hover:bg-blue-500 w-40 '><LogOut className='mr-2'/><h1 className='font-serif text-lg '>Logout</h1></Button1></div>
    </motion.div>
      <BackgroundBeams className='h-[200rem]'/>
    </div>
  )
}

export default TrainList
