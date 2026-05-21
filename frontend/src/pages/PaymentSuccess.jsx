import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { CheckCircle, AlertTriangle, Calendar, Clock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { backendUrl, token } = useContext(AppContext);
    
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [details, setDetails] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const appointmentId = searchParams.get('appointmentId');
    const statusParam = searchParams.get('success');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!token || !appointmentId) return;
            
            try {
                // 1. Verify with backend Stripe handler
                const { data } = await axios.post(
                    `${backendUrl}/api/user/verify-stripe`, 
                    { appointmentId, success: statusParam }, 
                    { headers: { token } }
                );

                if (data.success) {
                    setSuccess(true);
                    
                    // 2. Fetch specific appointment details to show custom receipt summary
                    const res = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
                    if (res.data.success) {
                        const apptObj = res.data.appointments.find(a => a.id == appointmentId);
                        setDetails(apptObj);
                    }
                } else {
                    setSuccess(false);
                    setErrorMsg(data.message || 'Payment verification failed.');
                }
            } catch (error) {
                console.error(error);
                setSuccess(false);
                setErrorMsg(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verifyPayment();
        }
    }, [token, appointmentId, statusParam, backendUrl]);

    if (loading) {
        return (
            <div className='min-h-[70vh] flex flex-col items-center justify-center py-12 px-4'>
                <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4'></div>
                <h3 className='text-xl font-bold text-secondary'>Verifying your transaction...</h3>
                <p className='text-gray-400 text-sm mt-1'>Please do not refresh the page or click back.</p>
            </div>
        );
    }

    return (
        <div className='min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in'>
            <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 text-center relative overflow-hidden'>
                
                {/* Decorative Premium Glow Background */}
                <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${success ? 'bg-primary' : 'bg-red-500'}`}></div>
                <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${success ? 'bg-teal-300' : 'bg-orange-300'}`}></div>

                {success ? (
                    <>
                        {/* Success Icon Wrapper */}
                        <div className='mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-50 text-emerald-500 shadow-inner scale-up-animation'>
                            <CheckCircle size={52} className='animate-pulse' />
                        </div>

                        <div className='space-y-2'>
                            <h2 className='text-3xl font-black text-secondary tracking-tight'>Payment Confirmed!</h2>
                            <p className='text-gray-500 font-semibold text-sm'>Your consultation slot has been successfully secured.</p>
                        </div>

                        {details && (
                            <div className='bg-gray-50 rounded-3xl p-5 border border-gray-100/80 text-left space-y-4'>
                                <div className='border-b border-gray-200 pb-3 flex items-center justify-between'>
                                    <div>
                                        <h4 className='font-black text-secondary'>{details.doctor_name}</h4>
                                        <p className='text-xs font-semibold text-primary uppercase tracking-wider mt-0.5'>{details.doctor_specialization}</p>
                                    </div>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] uppercase rounded-full tracking-wider'>
                                        PAID
                                    </span>
                                </div>

                                <div className='grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500'>
                                    <div className='space-y-1'>
                                        <span className='text-[10px] text-gray-400 uppercase tracking-widest block'>Appt Date</span>
                                        <span className='text-secondary flex items-center gap-1.5'><Calendar size={13} className='text-primary' /> {new Date(details.appointment_date).toDateString()}</span>
                                    </div>
                                    <div className='space-y-1'>
                                        <span className='text-[10px] text-gray-400 uppercase tracking-widest block'>Appt Time</span>
                                        <span className='text-secondary flex items-center gap-1.5'><Clock size={13} className='text-primary' /> {details.appointment_time}</span>
                                    </div>
                                    <div className='space-y-1 col-span-2'>
                                        <span className='text-[10px] text-gray-400 uppercase tracking-widest block'>Transaction ID</span>
                                        <span className='text-secondary font-mono tracking-tight text-[11px] block overflow-hidden text-ellipsis whitespace-nowrap'>{details.razorpay_order_id}</span>
                                    </div>
                                </div>

                                <div className='border-t border-gray-200 pt-3 flex items-center justify-between font-black text-secondary'>
                                    <span className='text-xs uppercase text-gray-400 tracking-wider'>Total Charged</span>
                                    <span className='text-lg'>₹{details.doctor_fees || details.fees}</span>
                                </div>
                            </div>
                        )}

                        <div className='flex flex-col gap-3 mt-8'>
                            <button 
                                onClick={() => navigate('/my-appointments')}
                                className='w-full py-4 rounded-2xl bg-primary hover:bg-teal-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300'
                            >
                                View My Bookings <ArrowRight size={14} />
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className='w-full py-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:-translate-y-0.5 transition-all duration-300'
                            >
                                Back to Home
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Error Icon Wrapper */}
                        <div className='mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-50 text-red-500 shadow-inner scale-up-animation'>
                            <AlertTriangle size={52} />
                        </div>

                        <div className='space-y-2'>
                            <h2 className='text-3xl font-black text-secondary tracking-tight'>Payment Failed</h2>
                            <p className='text-gray-500 font-semibold text-sm'>We couldn't confirm your transaction.</p>
                        </div>

                        <div className='bg-red-50/50 rounded-3xl p-5 border border-red-100 text-left'>
                            <p className='text-xs text-red-600 font-bold uppercase tracking-wider mb-1'>Error Details</p>
                            <p className='text-sm text-red-700 font-semibold'>{errorMsg || 'Stripe Session verification returned an incomplete status.'}</p>
                        </div>

                        <div className='flex flex-col gap-3 mt-8'>
                            <button 
                                onClick={() => navigate('/my-appointments')}
                                className='w-full py-4 rounded-2xl bg-secondary hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest hover:-translate-y-0.5 transition-all duration-300 shadow-xl'
                            >
                                Try Again from Appointments
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className='w-full py-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:-translate-y-0.5 transition-all duration-300'
                            >
                                Back to Home
                            </button>
                        </div>
                    </>
                )}

                {/* Secure Payment Footer badge */}
                <div className='flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-6 border-t border-gray-50 mt-8'>
                    <ShieldCheck size={14} className='text-primary' /> Secure payment verified via Stripe
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
