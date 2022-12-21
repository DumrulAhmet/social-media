import mongoose from 'mongoose'

export const mongodb = mongoose.connect('mongodb://127.0.0.1:27017/projenerasyon?authSource=projenerasyon', {
    user:'Radeonares',
    pass: 'KirilmaNoktasi42'
})